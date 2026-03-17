import { ChartNetwork, Home, Stethoscope,CircuitBoard, Hospital, ChartColumnBig, ChartColumn } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../../ui/sidebar'
import { Link } from 'react-router-dom'

const menu_items = [
    {
        title : "מסך בית",
        url : "/",
        icon : Home
    },
    {
        title : "כל המטופלים",
        url : "/patients",
        icon : Stethoscope
    },
    {
        title : "המלצות",
        url : "/recommendations",
        icon : Hospital
    },
    {
      
      title : "מכונות",
      url : "/machines",
      icon : CircuitBoard
    },
    {
        title : "ניתוח מכונות",
        url : "/analytics/machines",
        icon : ChartNetwork
    },
    {
        title : "סטטיסטיקות כלליות",
        url : "/analytics",
        icon : ChartColumn
    },
]

const AppSidebar = () => {
  return (
    <>
         <Sidebar variant='floating' side="right" className="h-auto max-h-fit z-50">
          <SidebarContent>
             <SidebarGroup>
              <SidebarGroupLabel >VANGUARD</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu_items.map((item) =>( 
                    <SidebarMenuItem key={item.title} className='p-1'>
                      <Link to={item.url}>
                      <SidebarMenuButton>
                        <item.icon/>
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
             </SidebarGroup>
          </SidebarContent>
         </Sidebar>
    </>
  )
}

export default AppSidebar