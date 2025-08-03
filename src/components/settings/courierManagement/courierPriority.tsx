


"use client"
import React, { useState, useMemo, useRef, useCallback, FC, DragEvent } from 'react';

// --- Type Definitions ---

interface Service {
    id: string;
    name: string;
    logo: string;
}

// --- Data ---
// In a real application, this would come from an API
const ALL_SERVICES: Service[] = [
    { 
        id: 'delhivery_surface', 
        name: 'Delhivery Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'delhivery_air', 
        name: 'Delhivery Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    { 
        id: 'ecom_express_surface', 
        name: 'Ecom Express Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'ecom_express_air', 
        name: 'Ecom Express Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    { 
        id: 'xpressbees_surface', 
        name: 'XpressBees Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'xpressbees_air', 
        name: 'XpressBees Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    { 
        id: 'bluedart_surface', 
        name: 'Bluedart Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'bluedart_air', 
        name: 'Bluedart Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    { 
        id: 'dtdc_surface', 
        name: 'DTDC Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'dtdc_air', 
        name: 'DTDC Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    { 
        id: 'india_post_surface', 
        name: 'India Post Surface', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-lime-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    { 
        id: 'india_post_air', 
        name: 'India Post Air', 
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-lime-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    {
        id: 'ekart_surface',
        name: 'Ekart Surface',
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    {
        id: 'ekart_air',
        name: 'Ekart Air',
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    },
    {
        id: 'amazon_shipping_surface',
        name: 'Amazon Shipping Surface',
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
    },
    {
        id: 'amazon_shipping_air',
        name: 'Amazon Shipping Air',
        logo: `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92V3a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.92A2 2 0 0 0 4 19h16a2 2 0 0 0 2-2.08zM12 5v14M6 10h12"></path></svg>`
    }
];

const servicesMap = new Map<string, Service>(ALL_SERVICES.map(service => [service.id, service]));

// --- Component Prop Types ---

interface PriorityItemProps {
    service: Service;
    index: number;
    onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnter: (e: DragEvent<HTMLDivElement>, index: number) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
    onRemove: (serviceId: string) => void;
}

interface ServiceCardProps {
    service: Service;
    isSelected: boolean;
    onSelect: (serviceId: string) => void;
}


// --- Components ---

/**
 * Priority List Item Component
 */
const PriorityItem: FC<PriorityItemProps> = ({ service, index, onDragStart, onDragEnter, onDragEnd, onRemove }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnter={(e) => onDragEnter(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        className="flex items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing transition-all duration-300 ease-in-out"
    >
        <div className="flex items-center space-x-4 flex-grow">
            <span className="text-lg font-bold text-indigo-600 w-6 text-center">{index + 1}</span>
            <div className="flex-shrink-0" dangerouslySetInnerHTML={{ __html: service.logo }} />
            <span className="font-semibold text-slate-800">{service.name}</span>
        </div>
        <button
            onClick={() => onRemove(service.id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${service.name}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
);

/**
 * Available Service Card Component
 */
const ServiceCard: FC<ServiceCardProps> = ({ service, isSelected, onSelect }) => (
    <div
        onClick={() => !isSelected && onSelect(service.id)}
        className={`p-4 border rounded-lg flex flex-col items-center justify-center text-center transition-all duration-300 ease-in-out ${
            isSelected 
            ? 'bg-slate-200 opacity-50 cursor-not-allowed' 
            : 'bg-slate-50 hover:bg-indigo-100 hover:shadow-md hover:border-indigo-300 cursor-pointer'
        }`}
    >
        <div dangerouslySetInnerHTML={{ __html: service.logo }} />
        <span className="mt-2 text-sm font-medium text-slate-700">{service.name}</span>
    </div>
);

/**
 * Main Component - CourierPriority
 */
const CourierPriority: FC = () => {
    const [priorityServiceIds, setPriorityServiceIds] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    // Refs for drag and drop state
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // Filtered services based on search term
    const availableServices = useMemo(() => 
        ALL_SERVICES.filter(service => 
            service.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);
        
    // Services currently in the priority list
    const priorityServices = useMemo(() => 
        priorityServiceIds.map(id => servicesMap.get(id)).filter((s): s is Service => s !== undefined), 
    [priorityServiceIds]);
    
    // --- Event Handlers ---

    const handleAddService = useCallback((serviceId: string) => {
        if (!priorityServiceIds.includes(serviceId)) {
            setPriorityServiceIds(prevIds => [...prevIds, serviceId]);
        }
    }, [priorityServiceIds]);

    const handleRemoveService = useCallback((serviceId: string) => {
        setPriorityServiceIds(prevIds => prevIds.filter(id => id !== serviceId));
    }, []);

    // --- Drag and Drop Handlers ---

    const handleDragStart = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        e.currentTarget.classList.add('opacity-50', 'scale-105', 'shadow-2xl');
    }, []);
    
    const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>, index: number) => {
        if (dragItem.current === null) return;

        dragOverItem.current = index;
        
        const newPriorityIds = [...priorityServiceIds];
        const draggedItemId = newPriorityIds.splice(dragItem.current, 1)[0];
        newPriorityIds.splice(dragOverItem.current, 0, draggedItemId);
        
        if(JSON.stringify(newPriorityIds) !== JSON.stringify(priorityServiceIds)) {
            setPriorityServiceIds(newPriorityIds);
            dragItem.current = dragOverItem.current;
            dragOverItem.current = null;
        }
    }, [priorityServiceIds]);

    const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50', 'scale-105', 'shadow-2xl');
        dragItem.current = null;
        dragOverItem.current = null;
    }, []);

    return (
        <div className="bg-slate-100 flex items-center  min-h-screen font-sans">
            <style>{`
                /* Using a more robust font import is recommended in a real app, e.g. Next/Font */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Inter', sans-serif; }
            `}</style>
            <div className="container mx-auto p-4 md:p-8 max-w-6xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Set Your Service Priority</h1>
                    <p className="text-slate-500 mt-2">Search for services and arrange them in your preferred order.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Priority List */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col">
                            <h2 className="text-xl font-semibold text-slate-700 mb-4 flex-shrink-0">Your Priority List</h2>
                            
                            {/* SCROLLABLE CONTAINER */}
                            <div className="space-y-4 overflow-y-auto min-h-[100px] pr-2">
                                {priorityServices.length > 0 ? (
                                    priorityServices.map((service, index) => (
                                        <PriorityItem
                                            key={service.id}
                                            service={service}
                                            index={index}
                                            onDragStart={handleDragStart}
                                            onDragEnter={handleDragEnter}
                                            onDragEnd={handleDragEnd}
                                            onRemove={handleRemoveService}
                                        />
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full text-center text-slate-400 p-8 border-2 border-dashed rounded-lg">
                                        Select services from the right to add them here.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Available Services */}
                    <div className="md:col-span-7 lg:col-span-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                            {/* Search Bar */}
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for a service (e.g., Delhivery Surface)"
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            {/* Service Grid */}
                            <h2 className="text-xl font-semibold text-slate-700 mb-4">Available Services</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {availableServices.length > 0 ? (
                                    availableServices.map(service => (
                                        <ServiceCard 
                                            key={service.id}
                                            service={service}
                                            isSelected={priorityServiceIds.includes(service.id)}
                                            onSelect={handleAddService}
                                        />
                                    ))
                                ) : (
                                    <p className="col-span-full text-center text-slate-500">No services found for {searchTerm}.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourierPriority;
