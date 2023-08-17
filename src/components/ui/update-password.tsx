// UpdatePasswordCard.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/supabase-auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UpdatePasswordCard() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold the error message
  const { updatePassword } = useAuth();
  const router = useRouter();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setConfirmPassword(value);
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setIsPasswordMatch(false);
      return;
    }

  try { 
    updatePassword(password);
    router.push("/app/events");
    } catch (error) {
      setError((error as Error).message); // Set the error message if the updatePassword function throws an error
  }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update Your Password</CardTitle>
        <CardDescription>Enter your new password below.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <input
            id="password"
            type="password"
            placeholder="New Password"
            autoComplete="new-password"
            onChange={handlePasswordChange}
            className={!isPasswordMatch ? "border-[#ff2eea]" : ""} // Add a class to indicate an error
          />
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            autoComplete="new-password"
            onChange={handleConfirmPasswordChange}
            className={!isPasswordMatch ? "border-[#ff2eea]" : ""} // Add a class to indicate an error
          />
          {!isPasswordMatch && (
            <p className="text-[#ff2eea]">Passwords do not match.</p>
          )}
          {error && <p className="text-[#ff2eea]">{error}</p>} {/* Display the error message */}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!password || !confirmPassword || !isPasswordMatch}
          onClick={handleSubmit}
        >
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}