'use client';

import type { NextPage } from "next";
import {  User } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import LoginLayout from "@/components/layouts/LoginLayout";
import LoginBox from "@/components/LoginBox";
import { BeakerIcon } from "@heroicons/react/24/outline";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect, useContext } from "react";
import { useAuth } from "@/components/providers/supabase-auth-provider";

const isEmpty = (obj: User | null | undefined): boolean => {
  if (obj === null) return true;
  return obj?.id === undefined;
};

const Login: NextPage = () => {
  let [open, setOpen] = useState(false);
  const router = useRouter();

  // if there is a user, get a user
  
  const {user, isLoading} = useAuth();

  console.log(user, isLoading);
  
  useEffect(() => {
    if (!isEmpty(user)) {
      router.push("/app");
    } else {
      setOpen(true);
    }
  }, [user]);


  return (
    <LoginLayout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[0.125rem]">
          <div className="bg-black p-8 rounded">
            <div className="flex flex-col items-center">
              <BeakerIcon className="h-20 w-20 stroke-red-500 animate-spin mb-4" />
              {isEmpty(user) ? (
                <>
                  {open ? (
                    <span className="loading">Authenticating</span>
                  ) : (
                    <span className="loading">Loading</span>
                  )}
                </>
              ) : (
                <span className="loading">Signing in</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[0.125rem]">
                    <div className="bg-zinc-950 p-8 rounded min-h-[12rem] flex flex-col justify-center">
                      {user ? (
                        <>
                          <BeakerIcon className="h-20 w-20 stroke-red-500 animate-spin mb-4 self-center" />
                          <span className="loading">Fetching user</span>
                        </>
                      ) : (
                        <LoginBox />
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </LoginLayout>
  );
};

export default Login;
