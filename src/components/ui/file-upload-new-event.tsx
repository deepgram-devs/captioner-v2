'use client';
import { Database } from "@/types/supabase";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";

function CircleCheck(){
    return (
        <div className="flex justify-center align-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    );
}
function UploadSpinner(){
    return (<div role="status" className="flex justify-center align-center">
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
</div>);
}


type FileUploadProps = {
    prospectusFile : File;
    setProspectusFile: (file: File) => void
}

export default function FileUploadNewEvent({prospectusFile, setProspectusFile}: FileUploadProps){
    
    const [propspectusFetched, setProspectusFetched] = useState(false);
    const [fileUploadState, setFileUploadState] = useState(0);

    
    const supabase = useSupabaseClient<Database>();

return(<div className="">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                {fileUploadState === 1 ? (
                    <UploadSpinner />
                    ) : fileUploadState === 2 ? (
                    <CircleCheck />
                    ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                    )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" accept=".pdf,.docx" className="sr-only" onChange={(e)=>{
                        if (!e.target.files) {
                            return;
                        };
                        // Checking if the file is a pdf or docx
                        if (e.target.files[0].type !== "application/pdf") {
                            alert("Please upload a PDF file");
                            return;
                        }
                        // Checking if the file is less than 10MB
                        if (e.target.files[0].size > 10000000) {
                            alert("Please upload a file less than 10MB");
                            return;
                        }
                        setProspectusFile(e.target.files[0]);
                        setFileUploadState(2);
                    }} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-400">PDF or DOCX up to 10MB</p>
                </div>
            </div>
        </div>
);
}