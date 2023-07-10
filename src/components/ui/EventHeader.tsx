import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase-browser";

const supabase = createClient();

const EventHeader = (props: { eventName?: string; isBroadcast?: boolean }) => {
  const router = useRouter();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("error", error);
      return alert(error.message);
    }
    router.push("/");
  };
  return (
    <header
      className={`flex p-6 w-full shrink-0 items-center justify-start bg-zinc-900`}
    >
      <svg
        className="logo"
        width="206.45"
        height="39.84"
        viewBox="0 0 800 155"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          data-v-eca600da=""
          d="M91.6075 17.8668C102.954 29.3925 109.056 44.6272 108.816 60.7592V60.7393C108.318 93.2226 81.019 119.644 47.9773 119.644H1.55537C0.677983 119.644 0.239288 118.587 0.857449 117.949L23.4502 95.2366C23.8291 94.8578 24.3276 94.6384 24.866 94.6384H48.416C67.3596 94.6384 83.2324 79.4835 83.7907 60.8789C84.0699 51.3871 80.5803 42.4138 73.96 35.5941C67.3397 28.7744 58.4661 25.0255 48.9942 25.0255H25.0255V63.7503C25.0255 64.0893 24.7663 64.3485 24.4273 64.3485H0.59822C0.259229 64.3485 0 64.0893 0 63.7503V0.598196C0 0.259204 0.259229 0 0.59822 0H48.9942C65.1263 0 80.2612 6.34112 91.6075 17.8668ZM159.645 32.0842C130.452 32.0842 117.132 54.4577 117.132 76.3126L117.112 76.3326C117.112 98.0281 132.147 120.9 161.34 120.9C182.238 120.9 198.47 109.255 202.178 91.0687C202.258 90.6899 201.959 90.3309 201.58 90.3309H179.546C179.287 90.3309 179.067 90.5104 178.987 90.7696C176.973 97.8286 170.712 101.438 161.34 101.438C149.396 101.438 141.718 93.9203 140.003 81.7963H201.261C201.58 81.7963 201.839 81.577 201.859 81.2579C202.019 79.4234 202.159 77.0505 202.159 74.0993C202.159 54.4577 188.838 32.0842 159.645 32.0842ZM159.645 49.4925C171.091 49.4925 177.751 57.1696 178.429 66.7411H140.342C142.396 54.7767 148.897 49.4925 159.645 49.4925ZM212.568 76.3126C212.568 54.4577 225.888 32.0842 255.081 32.0842C284.274 32.0842 297.595 54.4577 297.595 74.0993C297.595 77.0505 297.455 79.4234 297.295 81.2579C297.276 81.577 297.016 81.7963 296.697 81.7963H235.44C237.154 93.9203 244.832 101.438 256.776 101.438C266.148 101.438 272.41 97.8286 274.424 90.7696C274.503 90.5104 274.723 90.3309 274.982 90.3309H297.016C297.395 90.3309 297.694 90.6899 297.615 91.0687C293.906 109.255 277.674 120.9 256.776 120.9C227.583 120.9 212.548 98.0281 212.548 76.3326L212.568 76.3126ZM273.865 66.7411C273.187 57.1696 266.527 49.4925 255.081 49.4925C244.333 49.4925 237.832 54.7767 235.779 66.7411H273.865ZM333.947 33.4601H311.414V33.4202C311.075 33.4202 310.815 33.6795 310.815 34.0185V153.722C310.815 154.061 311.075 154.321 311.414 154.321H333.947C334.285 154.321 334.545 154.061 334.545 153.722V111.807C339.151 117.61 347.526 120.86 357.257 120.86C382.023 120.86 398.754 103.272 398.754 76.4722C398.754 49.6719 383.379 32.0842 359.132 32.0842C348.025 32.0842 339.669 36.192 334.545 42.8522V34.0583C334.545 33.7194 334.285 33.4601 333.947 33.4601ZM375.184 76.4921C375.184 90.8294 366.829 100.401 354.186 100.401C341.564 100.401 333.189 90.989 333.189 76.4921C333.189 61.9952 341.564 52.4237 354.186 52.4237C366.809 52.4237 375.184 62.1548 375.184 76.4921ZM433.451 136.315C433.829 135.936 434.328 135.736 434.866 135.736H459.074C466.412 135.736 471.537 129.934 471.537 122.077V110.811C467.09 117.132 458.037 120.881 447.967 120.881C422.523 120.881 407.328 103.293 407.328 76.4926C407.328 49.6923 422.523 32.1047 447.628 32.1047C458.217 32.1047 466.572 36.033 471.537 42.0152V34.0788C471.537 33.7398 471.796 33.4805 472.135 33.4805H494.668C495.007 33.4805 495.267 33.7398 495.267 34.0788V124.669C495.267 142.436 482.465 154.381 463.003 154.381H417.877C416.98 154.381 416.541 153.304 417.179 152.686L433.451 136.355V136.315ZM451.736 100.382C464.717 100.382 472.913 90.9895 472.913 76.4727C472.913 61.9559 464.717 52.4043 451.736 52.4043C438.755 52.4043 430.739 61.9758 430.739 76.4727C430.739 90.9696 439.114 100.382 451.736 100.382ZM536.484 118.906V77.669H536.504C536.504 62.9727 541.788 53.2416 553.573 53.2416H567.153C567.492 53.2416 567.751 52.9824 567.751 52.6434V34.0388C567.751 33.6998 567.492 33.4406 567.153 33.4406H558.179C547.591 33.4406 541.09 37.0099 536.484 47.7779V34.0388C536.484 33.6998 536.225 33.4406 535.886 33.4406H513.353C513.014 33.4406 512.755 33.6998 512.755 34.0388V118.906C512.755 119.245 513.014 119.505 513.353 119.505H535.886C536.225 119.505 536.484 119.245 536.484 118.906ZM575.348 95.0973C575.348 78.1876 587.991 67.9381 606.934 67.9381H621.272C625.539 67.9381 627.753 65.2062 627.753 61.6169C627.753 54.4382 622.289 49.493 612.558 49.493C602.827 49.493 596.964 55.6546 596.525 62.5939C596.525 62.913 596.266 63.1523 595.947 63.1523H575.987C575.628 63.1523 575.348 62.8532 575.368 62.4943C576.545 45.5447 590.483 32.0648 613.754 32.0648C635.609 32.0648 651.482 44.7072 651.482 64.1693V118.886C651.482 119.225 651.223 119.485 650.884 119.485H628.351C628.012 119.485 627.753 119.225 627.753 118.886V107.54C624.841 115.556 615.29 120.861 603.505 120.861C586.934 120.861 575.328 109.754 575.328 95.0773L575.348 95.0973ZM609.666 103.632C621.112 103.632 627.772 95.0973 627.772 84.1698V82.9733H610.524C603.186 82.9733 598.22 87.4201 598.22 94.0803C598.22 99.7235 603.006 103.652 609.666 103.652V103.632ZM689.09 33.4601H666.557L666.597 33.4402C666.258 33.4402 665.999 33.6995 665.999 34.0384V118.906C665.999 119.245 666.258 119.504 666.597 119.504H689.13C689.469 119.504 689.728 119.245 689.728 118.906V70.6695C689.728 59.5625 696.029 52.2243 705.94 52.2243C715.152 52.2243 721.135 59.5625 721.135 70.6695V118.906C721.135 119.245 721.394 119.504 721.733 119.504H744.266C744.605 119.504 744.864 119.245 744.864 118.906V70.6695C744.864 59.5625 751.165 52.2243 761.076 52.2243C770.288 52.2243 776.271 59.5625 776.271 70.6695V118.906C776.271 119.245 776.53 119.504 776.869 119.504H799.402C799.741 119.504 800 119.245 800 118.906V63.1518C800 45.923 787.876 32.0842 769.271 32.0842C755.453 32.0842 744.685 39.4224 740.417 47.7975C736.31 37.548 727.595 32.0842 714.116 32.0842C702.49 32.0842 694.294 37.7274 689.688 45.5841V34.0583C689.688 33.7194 689.429 33.4601 689.09 33.4601Z"
          fill="white"
        ></path>
      </svg>
      <div className="ml-[12px] text-white text-[36px] font-favorit">
        Event Captioner
      </div>
      <div className="ml-auto text-white text-[36px] font-favorit mr-4">
        {props.eventName
          ? props.isBroadcast
            ? props.eventName + " Broadcast"
            : props.eventName
          : ""}
      </div>
      {props.isBroadcast ? (
        <button onClick={logout} className="bg-[#208f68] px-4 py-2 rounded">
          Log Out
        </button>
      ) : null}
    </header>
  );
};

export default EventHeader;
