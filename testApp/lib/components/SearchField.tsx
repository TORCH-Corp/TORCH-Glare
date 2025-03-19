import { forwardRef, ReactNode } from "react";
import { Props, InputField } from "./InputField";

interface SearchProps extends Props {
    Searchplaceholder?: ReactNode
    secondaryPlaceholder?: ReactNode
}
// Use InputField types in the SearchInput component
export const SearchField = forwardRef<HTMLInputElement, SearchProps>(
    ({ Searchplaceholder, secondaryPlaceholder, ...props }, forwardedRef) => {
        return (
            <div className="mb-[10px] w-full h-fit justify-center items-center rounded-[12px] p-[3px] bg-[rgba(106,112,144,0.60)] shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)] backdrop-blur-[21px]">
                <InputField
                    {...props}
                    ref={forwardedRef}
                    type="text"
                    variant="SystemStyle"
                    size="M"
                    className="h-[54px] rounded-[12px] p-[15px] border-border-system-global-primary bg-[rgba(0,0,0,0.60)]"
                    icon={
                        <SearchInputPlaceholder secondaryPlaceholder={secondaryPlaceholder} Searchplaceholder={Searchplaceholder} />
                    }
                />
            </div>
        );
    }
);

SearchField.displayName = " SearchField"; // Set displayName for debugging


function SearchInputPlaceholder({ Searchplaceholder, secondaryPlaceholder }: { Searchplaceholder?: ReactNode, secondaryPlaceholder?: ReactNode }) {
    return (
        <div className="flex gap-[10px] justify-center items-center ">
            <i className="ri-search-2-line text-[24px] text-[#E5E5E5]"></i>
            <div className="flex gap-[5px] justify-center items-center">
                <p className="text-content-system-global-primary  typography-headers-medium-regular leading-none opacity-[0.8] ">{Searchplaceholder}</p>
                <p className="text-content-system-global-primary  typography-body-medium-medium leading-none opacity-30 mix-blend-luminosity">{secondaryPlaceholder}</p>
            </div>
        </div>
    )
}