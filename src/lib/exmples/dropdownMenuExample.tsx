import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/base/DropdownMenu";

import { cn } from "@/components/base/utils";
import { useTheme } from "@/providers/ThemeProvider";
import { useState } from "react";

export default function DropdownMenuExample() {
  const { theme } = useTheme();
  const [ThemeVariants] = useState<"PresentationStyle" | "SystemStyle" | any>([
    "PresentationStyle",
    "SystemStyle",
  ]);
  return (
    <>
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          DropdownMenu Variants
        </h2>
        <div className="flex gap-8">
          {ThemeVariants.map((variant: any) => (
            <div key={variant} className="flex flex-col items-center">
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn("p-2 rounded-md bg-[var(--background-presentation-form-base)] border border-[var(--border-presentation-global-primary)] text-[var(--content-presentation-global-primary)]",
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  SHOW {variant}
                </DropdownMenuTrigger>
                <DropdownMenuContent variant={variant}>
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}

                    >
                      Keyboard shortcuts
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuCheckboxItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      Check IT
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      Team
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger
                        variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                      >
                        Invite users
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent
                          variant={variant === "PresentationStyle" ? "PresentationStyle" : "SystemStyle"}
                          sideOffset={6}
                        >
                          <DropdownMenuItem
                            variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                          >
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant={variant === "PresentationStyle" ? "Warning" : "SystemStyle"}
                          >
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant={variant === "PresentationStyle" ? "Negative" : "SystemStyle"}

                          >
                            More...
                          </DropdownMenuItem>
                        </DropdownMenuSubContent  >
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                    >
                      New Team
                      <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                  >
                    GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                  >
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                  >
                    API
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant={variant === "PresentationStyle" ? "Default" : "SystemStyle"}
                  >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
