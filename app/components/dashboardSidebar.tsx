"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  FileTextIcon,
  FlagIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { parseRole, type Role } from "@/lib/roles"

type MenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

const DASHBOARD_MENU_ITEMS: Record<Role, readonly MenuItem[]> = {
  seeker: [
    { name: "Overview", url: "/dashboard/seeker", icon: LayoutDashboardIcon },
    {
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: FileTextIcon,
    },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: BookmarkIcon },
    { name: "Profile", url: "/dashboard/seeker/profile", icon: UserIcon },
    {
      name: "Settings",
      url: "/dashboard/seeker/settings",
      icon: SettingsIcon,
    },
  ],
  recruiter: [
    {
      name: "Overview",
      url: "/dashboard/recruiter",
      icon: LayoutDashboardIcon,
    },
    {
      name: "Post a Job",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircleIcon,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: BriefcaseIcon,
    },
    {
      name: "Applicants",
      url: "/dashboard/recruiter/applicants",
      icon: UsersIcon,
    },
    {
      name: "Company Profile",
      url: "/dashboard/recruiter/company",
      icon: Building2Icon,
    },
    {
      name: "Settings",
      url: "/dashboard/recruiter/settings",
      icon: SettingsIcon,
    },
  ],
  admin: [
    { name: "Overview", url: "/dashboard/admin", icon: LayoutDashboardIcon },
    { name: "Users", url: "/dashboard/admin/users", icon: UsersIcon },
    { name: "Job Posts", url: "/dashboard/admin/jobs", icon: BriefcaseIcon },
    {
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building2Icon,
    },
    { name: "Reports", url: "/dashboard/admin/reports", icon: FlagIcon },
    { name: "Settings", url: "/dashboard/admin/settings", icon: SettingsIcon },
  ],
}

const DashboardSidebar = () => {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()
  const { data: session, isPending } = useSession()
  const role = parseRole(session?.user?.role)
  const items = DASHBOARD_MENU_ITEMS[role]
  

  return (
    <Sidebar className="md:top-[88px] md:h-[calc(100svh-88px)] lg:top-[100px] lg:h-[calc(100svh-100px)]">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {isPending
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex h-8 items-center gap-2 rounded-md px-2"
                  >
                    <Skeleton className="size-4 rounded-md" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))
              : items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={pathname === item.url}
                      onClick={() => setOpenMobile(false)}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default DashboardSidebar
