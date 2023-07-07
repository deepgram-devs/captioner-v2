import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { BeakerIcon } from "@heroicons/react/24/outline";
import { useSupabase } from "@/components/providers/supabase-provider";

const LoginBox = () => {

  const { supabase } = useSupabase();

  return (
    <>
      <div className="flex flex-col items-center">
        <BeakerIcon className="h-20 w-20 stroke-red-500 mb-4" />
        <h2 className="text-4xl font-bold leading-loose">Deepbin</h2>
      </div>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          extend: true,
          variables: {
            default: {
              colors: {
                brandAccent: "black",
              },
            },
          },
          className: {
            button: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
          },
        }}
        theme="dark"
        providers={[]}
      />
    </>
  );
};

export default LoginBox;
