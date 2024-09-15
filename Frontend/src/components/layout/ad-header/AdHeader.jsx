import { Link } from "react-router-dom";

const AdHeader = () => {
  return (
    <>
      <div className="w-screen h-[70px] lg:px-28 md:h-[40px] bg-[#1E293B] text-left flex-col md:flex md:flex-row md:items-center md:justify-between">
        <h3 className="text-sm px-4 text-gray-400 border-b md:border-none py-2">
          Free shipping for standard order over ₹2000
        </h3>
        <div className="flex  gap-10 pt-1 md:pt-0">
          <Link to="">
            <p className="text-sm text-gray-500 md:border-x px-4">
              Help & FAQs
            </p>
          </Link>
          <Link to="" className="text-sm text-gray-400 md:border-r px-4">
            Account
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdHeader;
