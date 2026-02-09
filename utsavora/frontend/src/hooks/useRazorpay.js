import { useState, useCallback } from "react";

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        setIsLoaded(true);
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        setIsLoaded(true);
        resolve(true);
      };
      script.onerror = () => {
        setIsLoaded(false);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }, []);

  const displayRazorpay = useCallback(async (options) => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const rzp1 = new window.Razorpay(options);
    
    // Explicitly handle failure if needed
    // rzp1.on('payment.failed', function (response){
    //     alert(response.error.description);
    // });

    rzp1.open();
  }, [loadRazorpay]);

  return { isLoaded, displayRazorpay };
};

export default useRazorpay;
