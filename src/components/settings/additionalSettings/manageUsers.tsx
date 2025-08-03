

"use client"
// import axios from "axios";
import internalApi from '@/app/interceptors/internalAPI';
// import api from "@/app/interceptors/tokenexpire";
import React, { useState, useEffect,useCallback, useMemo } from 'react';
import { X, Search,MoreHorizontal  } from 'lucide-react';
import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import ThreeBodyLoader from '@/components/loader/loader';
// --- Interface Definitions ---
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: string;
  modules: string[];               // permission IDs
  buyerDetailAccess: 'ALLOWED' | 'NOT ALLOWED';
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  permissions: string[];          // IDs
  buyerDetailAccess: 'Allowed' | 'Not Allowed';
}

interface ApiPermission {
  id: string;
  tag: string;
  description: string | null;
}

const ManageUsers: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<ApiPermission[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({
    firstName: '', lastName: '', email: '', role: '', permissions: [], buyerDetailAccess: 'Not Allowed'
  });
  const [showPermissionsDropdown, setShowPermissionsDropdown] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading,setLoading] = useState(true);

  const roles = ['Executive', 'Others'];
  

  // const getAuthHeaders = () => {
  //   const token = localStorage.getItem('access_token');
  //   if (!token) { setError('Authentication token not found.'); return null; }
  //   return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } };
  // };

  useEffect(() => {
  if ((showAddModal || editingUser) && error){
    const timer = setTimeout(() => {
      setError(null);
    }, 3000); // 3 seconds
  

    // Cleanup: clear timer if modal closes or error changes
    return () => clearTimeout(timer);
  }
}, [error, showAddModal]);
  
  useEffect(() => {
  // After fetching users from API and mapping to User[]
  setUsers(users);
  setFilteredUsers(users);
}, [users]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      // const auth = getAuthHeaders(); if (!auth) { setIsLoading(false); return; }
      try {
        const [permRes, userRes] = await Promise.all([
          internalApi.get(`/api/user-permissions`),
          internalApi.get(`/api/user`)
        ]);
        // console.log('raw /auth/user response:', userRes.data);
        console.log('raw /auth/user  permisson response:', permRes.data);
        if (permRes.data.success) setPermissionOptions(permRes.data.data as ApiPermission[]);
        if (userRes.data.success) {
          const fetched: User[] = (userRes.data.data as any[]).map(u => ({
            id: u.id,
            firstName: u.first_name,
            lastName: u.last_name,
            email: u.email,
            lastLogin: u.last_login_at || 'NA',
            modules: u.permissions?.map((p: any) => p.id) || [],
            buyerDetailAccess: u.buyer_detail_access ? 'ALLOWED' : 'NOT ALLOWED',
            role: u.role || 'N/A',
            status: u.is_active ? 'ACTIVE' : 'INACTIVE'
          }));
          setUsers(fetched);
          setLoading(false);

          // console.log("these are the users ",users)
          // console.log("modules : ",fetched)
        }
      } catch (e: any) {
        // setError(e.response?.data?.message || 'Failed to fetch data.');
        toast.error(e.response?.data?.message);
      } finally { setIsLoading(false); }
    };
    fetchData();
  }, []);
  


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchTerm(value);
  debouncedFilterUsers(value); // Use the debounced function
};


  const filterUsers = useCallback(
  (value: string) => {
    if (!value.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lower = value.trim().toLowerCase();
    const filtered = users.filter(user =>
      (user.firstName && user.firstName.toLowerCase().includes(lower)) ||
      (user.lastName && user.lastName.toLowerCase().includes(lower)) || 
      (user.email && user.email.toLowerCase().includes(lower))
    );
    setFilteredUsers(filtered);
  },
  [users]

);

const debouncedFilterUsers = useMemo(
  () => debounce(filterUsers, 300), // 300ms delay
  [filterUsers]
);

   useEffect(() => {
  return () => {
    debouncedFilterUsers.cancel();
  };
}, [debouncedFilterUsers]); 

  // console.log("these are the filtered users: ",filteredUsers)


  const refetchUsers = async () => {
    // const auth = getAuthHeaders(); if (!auth) return;
    try {
      const res = await internalApi.get(`/api/user`);
      // console.log("this is response",res)

      if (res.data.success) {
      const fetched: User[] = (res.data.data as any[]).map((u): User => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        lastLogin: u.last_login_at ?? 'NA',
        modules: (u.permissions ?? []).map((p: any) => p.id),
        buyerDetailAccess: u.buyer_detail_access
          ? 'ALLOWED'
          : 'NOT ALLOWED',            // <- literal fits the union
        role: u.role ?? 'N/A',
        status: u.is_active ? 'ACTIVE' : 'INACTIVE',
      }));

      setUsers(fetched);               // now type-safe
    }
    } catch(err:any) { toast.error(err.response?.data?.message || 'Failed to refetch users.');}
  };

  const handleAddUser = async () => {
    setIsLoading(true); 
    
    try {
      const res = await internalApi.post(
        `/api/add-user`,
        { first_name: newUser.firstName, last_name: newUser.lastName, email: newUser.email,
          role: newUser.role, permissions: newUser.permissions,
          buyer_detail_access: newUser.buyerDetailAccess === 'Allowed' }
      );
      console.log("this is the response to add the user: ",res)
      if (res.status) {
        await refetchUsers();
        setNewUser({ firstName:'',lastName:'',email:'',role:'',permissions:[],buyerDetailAccess:'Not Allowed' });
        setShowAddModal(false); setShowPermissionsDropdown(false);
        toast.success("User added successfully!")
        // alert('User added successfully!');


      }
    } catch (e: any) {
      console.log("this is e ",e);
      setError(e.response?.data?.message || 'Failed to add user.');
      // toast.error(e.response?.data?.message || 'Failed to add user.');
    } finally { setIsLoading(false); }
  };

  const handleUpdateUser = async () => {
    console.log("editing user: ",editingUser)
    if (!editingUser) return;
    setIsLoading(true);
    // const auth = getAuthHeaders(); if (!auth) { setIsLoading(false); return; }
    try {
      console.log("editing user: ",editingUser)
      await internalApi.patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/${editingUser.id}`,
        { first_name: editingUser.firstName , last_name: editingUser.lastName, email: editingUser.email, role: editingUser.role,
          permissions: editingUser.modules,
          buyer_detail_access: editingUser.buyerDetailAccess === 'ALLOWED' },
        
      );
      await refetchUsers(); setEditingUser(null); 
      toast.success("User updated successfully!")
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to update user.');
      // toast.error(e.response?.data?.message);
    } finally { setIsLoading(false); }
  };

  // const toggleUserStatus = async (id: string, status: 'ACTIVE'|'INACTIVE') => {
  //   setIsLoading(true); 
  //   // const auth = getAuthHeaders(); if (!auth) { setIsLoading(false); return; }
  //   try {
  //     await internalApi.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user/${id}`, { is_active: status==='INACTIVE' });
  //     await refetchUsers();
  //   } catch (e: any) {
  //     // setError(e.response?.data?.message || 'Failed to update user status.');
  //     toast.error(e.response?.data?.message);
  //   } finally { setIsLoading(false); }
  // };

  const handlePermissionToggle = (pid: string) => {
    setNewUser(prev => ({
      ...prev,
      permissions: prev.permissions.includes(pid)
        ? prev.permissions.filter(id => id!==pid)
        : [...prev.permissions,pid]
    }));
  };
  if(loading){
    return (
      <ThreeBodyLoader/>
    )
  }
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Manage Users</h1>
          <p className="text-gray-600">Create users and assign permissions based on their roles.</p>
        </div>
        <button onClick={()=>setShowAddModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
          + Add New User
        </button>
      </div>

      {/* {isLoading && <p className="text-center text-purple-600">Loading...</p>} */}
     

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search using Name, Email ID"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchTerm}
            onChange={handleSearch}
          />

        </div>
      </div>

      <p className="text-gray-600 mb-4">{users.length} User{users.length!==1?'s':''} Displayed</p>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer Detail Access</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map(u=>(
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                {u.firstName} {u.lastName}
              </div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.lastLogin}</td>
                <td className="px-6 py-4 ">
                  <div className="flex flex-wrap gap-1">
                    {u.modules.map(id=>{
                      const p=permissionOptions.find(x=>x.id===id);
                      return <span key={id} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">{p?.tag||id}</span>
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${u.buyerDetailAccess==='ALLOWED'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{u.buyerDetailAccess}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{u.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${u.status==='ACTIVE'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{u.status}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {/* <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={u.status==='ACTIVE'} onChange={()=>toggleUserStatus(u.id,u.status)} className="sr-only peer" disabled={isLoading} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer-checked:bg-purple-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all"></div>
                    </label> */}
                    <button onClick={()=>setEditingUser(u)} className="text-gray-400 hover:text-gray-600" disabled={isLoading}><MoreHorizontal /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <>
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New User</h2>
              <button onClick={()=>{setShowAddModal(false);setShowPermissionsDropdown(false); setNewUser({ firstName:'',lastName:'',email:'',role:'',permissions:[],buyerDetailAccess:'Not Allowed' });}} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
             {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
         )}
            <p className="text-gray-600 text-sm mb-6">An email will be sent to the specified address with login instructions.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" value={newUser.firstName} onChange={e=>setNewUser({...newUser,firstName:e.target.value})} placeholder="Enter first name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={newUser.lastName} onChange={e=>setNewUser({...newUser,lastName:e.target.value})} placeholder="Enter last name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input type="email" value={newUser.email} onChange={e=>setNewUser({...newUser,email:e.target.value})} placeholder="Enter Email ID" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select value={newUser.role} onChange={e=>setNewUser({...newUser,role:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                    <option value="">Select role</option>
                    {roles.map(role=> <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                  <div className="relative">
                    <button type="button" onClick={()=>setShowPermissionsDropdown(!showPermissionsDropdown)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-left flex justify-between items-center">
                      <span className="text-gray-500">{newUser.permissions.length>0?`${newUser.permissions.length} selected`:'Select permissions'}</span>
                      <svg className={`w-4 h-4 transition-transform ${showPermissionsDropdown?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    {showPermissionsDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                        <div className="p-2 max-h-48 overflow-y-auto">
                          {permissionOptions.map(p=> (
                            <label key={p.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                              <input type="checkbox" checked={newUser.permissions.includes(p.id)} onChange={()=>handlePermissionToggle(p.id)} className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"/>
                              <span className="text-sm">{p.tag}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Buyer Detail Access</label>
                <div className="flex gap-6">
                  <label className="flex items-center"><input type="radio" name="buyerAccess" value="Allowed" checked={newUser.buyerDetailAccess==='Allowed'} onChange={e=>setNewUser({...newUser,buyerDetailAccess:e.target.value as any})} className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"/>Allowed</label>
                  <label className="flex items-center"><input type="radio" name="buyerAccess" value="Not Allowed" checked={newUser.buyerDetailAccess==='Not Allowed'} onChange={e=>setNewUser({...newUser,buyerDetailAccess:e.target.value as any})} className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"/>Not Allowed</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>{setShowAddModal(false);setShowPermissionsDropdown(false);}} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleAddUser} disabled={isLoading||!newUser.firstName||!newUser.lastName||!newUser.email||!newUser.role} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                {isLoading?'Adding...':'Add User'}
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {editingUser && (
        <>
        
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
            {error && (
        <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit User: {editingUser.firstName}</h2>
              <button onClick={()=>setEditingUser(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input type="text" value={editingUser.firstName} onChange={e=>setEditingUser({...editingUser,firstName:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" value={editingUser.lastName} onChange={e=>setEditingUser({...editingUser,lastName:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
                </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="text" value={editingUser.email} onChange={e=>setEditingUser({...editingUser,email:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
                </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={editingUser.role} onChange={e=>setEditingUser({...editingUser,role:e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {roles.map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modules</label>
                <div className="grid grid-cols-2 gap-2 p-2 border rounded-lg max-h-32 overflow-y-auto">
                  {permissionOptions.map(p=>(
                    <label key={p.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={editingUser.modules.includes(p.id)} onChange={e=>{
                        const updated = e.target.checked ? [...editingUser.modules,p.id] : editingUser.modules.filter(id=>id!==p.id);
                        setEditingUser({...editingUser,modules:updated});
                      }} className="h-4 w-4 text-purple-600 accent-purple-600"/>
                      <span className="text-sm">{p.tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={()=>setEditingUser(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                <button onClick={handleUpdateUser} disabled={isLoading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300">
                  {isLoading?'Saving...':'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default ManageUsers;
