// import { useLocation } from "react-router-dom"; 
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Images } from "../constant";

// const NotFound = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   useEffect(() => {
//     console.error(
//       "404 Error: User attempted to access non-existent route:",
//       location.pathname
//     );
//   }, [location.pathname]);

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white relative overflow-hidden p-4">
//       {/* Background subtle gradient */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950 to-black"></div>
      
//       {/* Content container with glass effect */}
//       <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
//         {/* Error message */}
//         <h1 className="text-7xl font-bold mb-4">404 <br /> Page Not Found</h1>

//         {/* KAWS Image with float animation */}
//         {/* <div className="animate-float mb-8">
//           <img
//             src={Images.error}
//             alt="KAWS Figurines"
//             className="w-full max-w-2xl mx-auto object-cover h-40 w-40 rounded-lg mt-16"
//           />
//         </div> */}
//       </div>

//       {/* Decorative elements */}
//       <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
//     </div>
//   );
// };

// export default NotFound;
