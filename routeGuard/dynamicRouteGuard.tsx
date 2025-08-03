"use client";
import { ReactNode, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface DynamicRouteGuardProps {
  children: ReactNode;
}

export const DynamicRouteGuard: React.FC<DynamicRouteGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const prevPath = useRef<string>("/");
  const router = useRouter();

  // 1) Track previous path
  useEffect(() => {
    prevPath.current = pathname;
  }, [pathname]);

  // 2) On each navigation change, check permission
  useEffect(() => {
    if (!user) return; // if not logged in, let your Auth guard handle that
    if(pathname==="/"){
        return;
    }
    console.log("these are the users detials ",user)
    // "/orders/123" -> [ "", "orders", "123" ], so index 1 is our segment
    const firstSegment: string = pathname.split("/")[1] ??"";
    console.log("these are the first segment :",firstSegment)
   

    // user_permissions is string[]
    const isAllowed: boolean = user.user_permissions.includes(firstSegment);
    console.log("These are the allowed paths :",isAllowed)

    if (!isAllowed) {
      // Redirect back
      router.push("/");
      // Show global toast
      toast.error("You are not allowed on this path");
    }
  }, [pathname, user, router]);

  return <>{children}</>;
};
