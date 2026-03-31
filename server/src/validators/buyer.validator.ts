import type { IBuyer } from "../Model/BuyerModel.js";


export const buyerRegistrationValidator = (body: Partial<IBuyer>): string | null => {
    const { name, email, password } = body;
    if (!name || name.trim().length < 2 || name.trim().length > 50) {
        return "Name must be between 2 and 50 characters";
    }

    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return "Please provide a valid email";
    }

    if (!password || password.length < 6) {
        return "Password must be at least 6 characters";
    }


    return null;
}


export const buyerLoginValidator=(body:Partial<IBuyer>):string|null=>{
     const{email,password}=body;
     if(!email||!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        return "Eamil address is required or Please provide a valid email";
     }

       if (!password) {
        return "Password must be at least 6 characters";
    }

    return null;
}