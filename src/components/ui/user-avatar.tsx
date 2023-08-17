import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { useAuth } from "@/components/providers/supabase-auth-provider"

export function UserAvatar() {
  const {user} = useAuth()
  return (
    <Avatar>
      {user?.invited_at ? (
        <AvatarImage alt="Picture" src={user.invited_at} />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.email}</span>
          <User className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}