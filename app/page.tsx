import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex justify-center gap-4.5 bg-amber-300">
      <SignInButton />
      <SignUpButton />
      <UserButton />
    </div>
  );
}
