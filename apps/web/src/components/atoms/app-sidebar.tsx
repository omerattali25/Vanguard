import { BookA, Home } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'
import { Link } from 'react-router-dom'

const menu_items = [
    {
        title : "מסך בית",
        url : "/",
        icon : Home
    }
]

const AppSidebar = () => {
  return (
    <>
         <Sidebar variant='floating' side="right" className="z-50">
          <SidebarContent>
             <SidebarGroup>
              <SidebarGroupLabel >VANGUARD</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menu_items.map((item) =>( 
                    <SidebarMenuItem key={item.title}>
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