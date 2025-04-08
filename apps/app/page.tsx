'use client';
import { InputOTPSeparator } from "@/components/InputOTP";
import { InputOTP } from "@/components/InputOTP";
import { InputOTPSlot } from "@/components/InputOTP";
import { InputOTPGroup } from "@/components/InputOTP";
import Examples from "../exmples";
import { Toggle } from "@/components/Toggle";

export default function page() {


  return (
    <div className="flex flex-col gap-4 bg-black w-full h-full">
      <Examples />
    </div>


  );
}


// using with react hook form lib
/*
     <InputGroup >
        <Icon>
          <i className="ri-mail-ai-line"></i>
        </Icon>
        <Input />
      </InputGroup>

      <InputField icon={<i className="ri-mail-ai-line"></i>} />
*/