import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

// axios.defaults.withCredentials = true;

function App() {

  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(false);
  const limit = 5;

  function debounce(func, delay) {
    let timeoutId;

    return function (...args) {
      console.log("Args: ",...args)
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }


  useEffect(() => {

    const fetchProducts = async () => {
      setLoading(true)
      try {

        const response = await axios.get(`https://dummyjson.com/products?skip=${offset}&limit=${limit}`);
        console.log("Response: ", response);
        const { data } = response;
        if (response.status === 200 && data) {
          setLoading(false)
          setProducts(data?.products);
        }

      } catch (error) {
        console.log("Error Fetching APi: ", error)
        setLoading(false)

      }
    }
    fetchProducts()

  }, [offset])

  const handleScroll = () => {
    if (!loading && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setOffset((prevOffset) => prevOffset + 1);
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 500); // Adjust the delay as needed

  useEffect(() => {
    window.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll]);



  return (
    <>
      <div className=" h-full w-full flex items-center justify-center flex-col">

        {console.log("PRODUCTS: ", products)}
        <div className="p-5 my-10">
          <h1 className="text-3xl font-medium">Infinite Scrolling</h1>
        </div>


        {(loading) ? <Loader /> :
          < >
            {products?.map(item => {
              return (
                <div key={item.id} className=" p-5 w-full xs:w-[400px] sm:w-[500px] md:w-[600px] flex items-center justify-center flex-col">

                  <div className="flex items-center justify-center flex-col rounded-lg px-4 sm:px-10 py-8 " style={{ boxShadow: "0px 0px 7px #ccc" }}>
                    {/* Image */}
                    <img src={item.images[0]} alt="product" className="w-[250px] h-[300px] object-contain" />
                    {/* Details */}

                    {/* category */}
                    <div className=" w-full mt-8 px-2 lg:px-8">
                      <h1 className="text-orange-400  text-lg sm:text-xl md:text-xl lg:text-xl font-bold ">{item?.category}</h1>
                    </div>

                    <div className="flex flex-col gap-3 p-2  lg:px-8 w-full my-5">
                      {/* title */}
                      <h1 className="text-2xl text-pretty">{item.title}</h1>
                      {/* description */}
                      <p>
                        {item.description}
                      </p>
                      {/* price */}
                      <h1 className="text-4xl font-bold">$ {item.price}</h1>
                      {/* button */}
                      <button className="bg-yellow-400 py-2 rounded-lg my-4">Add to Cart</button>
                    </div>
                  </div>

                </div>
              )
            })}

          </>
        }



      </div>
    </>
  )
}

export default App


const Loader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        <div role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-orange-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div> </div>
  )
}
