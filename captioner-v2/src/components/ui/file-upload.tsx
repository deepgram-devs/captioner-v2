'use client';
import { DGEvent } from "@/types/event";
import { PhotoIcon } from "@heroicons/react/20/solid";
import { createClient } from "@/utils/supabase-browser";
import { useEffect, useState } from "react";

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

function DownloadIcon(){
    return(
        <div>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
</svg></div>);
}

type FileUploadProps = {
    event: DGEvent;
    prospectusFile : File;
    setProspectusFile: (file: File) => void
}

export default function FileUpload({event, prospectusFile, setProspectusFile}: FileUploadProps){
    
    const [propspectusFetched, setProspectusFetched] = useState(false);
    const [fileUploadState, setFileUploadState] = useState(0);

    
    const supabase = createClient();



    async function uploadFile(file: File) {
        setFileUploadState(1);
        if (file != null) {
            // Replace prospectus if it already exists
            if (propspectusFetched) {
                const { data: fileData, error: fileError } = await supabase.storage
              .from("event-prospectus")
              .update(`${event.id}/Prospectus`, file, {
                cacheControl: "3600",
              });
            if (!fileError) {
                console.log("file updated");
                setFileUploadState(2);
                downloadProspectus();
            }
            else{
                setFileUploadState(0);
                alert("There was some error uploading the file. Please try again.");
            }

            } else{
            const { data: fileData, error: fileError } = await supabase.storage
              .from("event-prospectus")
              .upload(`${event.id}/Prospectus`, file, {
                cacheControl: "3600",
                upsert: false,
              });
            if (!fileError) {
                setFileUploadState(2);
                console.log("file uploaded");
                downloadProspectus();
            }
            else{
                setFileUploadState(0);
                alert("There was some error uploading the file. Please try again.");
            }
        }
        }
        else{
            alert("There was some error uploading the file. Please try again. Here");
            setFileUploadState(0);
        }
    }

    async function getProspectus(){
        try{
        const { data: fileData, error: fileError } = await supabase.storage
        .from("event-prospectus")
        .download(`${event.id}/Prospectus`);
        if (!fileError) {
            return fileData;
        }
        else{
            return null;
        }
    } catch(e){
        console.log(e);
        return null;
    }

    }
    
    function downloadFile() {
        try{
        const { data } = supabase.storage
        .from("event-prospectus")
        .getPublicUrl(`${event.id}/Prospectus`);

        if (data) {
            window.open(data.publicUrl, '_blank');
        }}
        catch(e){
            alert("There was some error downloading the file. Please try again.");
        }
    }

    function downloadProspectus(){
        getProspectus().then((data)=>{
            if (data) {
                setProspectusFetched(true);
            }
        });
    }

    useEffect(()=>{
    if (event.id) {
        downloadProspectus();
        console.log("prospectus fetched");
    }}, [event]);

return(<div className="">

    { propspectusFetched && (
    <button
        type="button"
        className="my-5 rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        onClick={()=>{
            downloadFile();
        }}
    >
        <div className="flex flex-row gap-x-4 justify-center align-center">
        Download Prospectus <DownloadIcon />
        </div>
    </button>)}
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
                        uploadFile(e.target.files[0]);
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