
import PropertyCard from "./components/UI/PropertyCard";
import { PaginatedResponse, Property } from "./types/ApiResponse";


export const propertyApi = {
  getAll: async (page: number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?page=${page}`, {
      cache: "force-cache", // <-- caching on server
      next: { revalidate: 60 }, // ISR: regenerate every 60 seconds
    });
    const data = await res.json();
    return data;
  },
};




export default async function Home() {
  try {
    const res: PaginatedResponse<Property> = await propertyApi.getAll(1);
    return (
      <div>
        {/* Hero Section */}
        <section className="relative bg-[#f95959] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col-reverse md:flex-row items-center md:justify-between">

            {/* Text Content */}
            <div className="w-full flex justify-center items-center flex-col">
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold mb-4">
                Find Your Dream Property
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-200">
                Browse through thousands of properties to find the perfect home for you.
              </p>

            </div>



          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-25 pointer-events-none"></div>
        </section>

        {/* Property Grid */}
        <section id="properties" className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center md:text-left">
            Available Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {res?.data?.map((property) => (
              <PropertyCard data={property} key={property._id} />
            ))}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error fetching properties:", error);
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-red-500">
          Failed to load properties. Please try again later.
        </h2>
      </div>
    );
  }


}