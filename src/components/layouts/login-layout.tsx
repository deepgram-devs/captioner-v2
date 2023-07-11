type LoginLayout = {
  children: React.ReactNode;
};

const LoginLayout = ({ children }: LoginLayout) => {
  return (
    <div className="min-h-screen min-w-full w-screen h-screen bg-zinc-900 flex flex-col justify-center">
      {children}
    </div>
  );
};

export default LoginLayout;
