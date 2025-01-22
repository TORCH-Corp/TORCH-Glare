import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/base/DropdownMenu";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/base/DropdownMenuItem";
import { cn } from "@/lib/utils";
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
                  className={cn(
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  SHOW {variant}
                </DropdownMenuTrigger>
                <DropdownMenuContent variant={variant}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Default"
                      }
                    >
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Negative"
                      }
                    >
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Negative"
                      }
                    >
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Warning"
                      }
                    >
                      Keyboard shortcuts
                      <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuCheckboxItem variant={variant}>
                      Check IT
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Default"
                      }
                    >
                      Team
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger
                        variant={
                          variant == "SystemStyle" ? "SystemStyle" : "Default"
                        }
                      >
                        Invite users
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent
                          variant={
                            variant as "PresentationStyle" | "SystemStyle"
                          }
                          sideOffset={6}
                        >
                          <DropdownMenuItem
                            variant={
                              variant == "SystemStyle"
                                ? "SystemStyle"
                                : "Default"
                            }
                          >
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant={
                              variant == "SystemStyle"
                                ? "SystemStyle"
                                : "Warning"
                            }
                          >
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant={
                              variant == "SystemStyle"
                                ? "SystemStyle"
                                : "Negative"
                            }
                          >
                            More...
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      variant={
                        variant == "SystemStyle" ? "SystemStyle" : "Default"
                      }
                    >
                      New Team
                      <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant={
                      variant == "SystemStyle" ? "SystemStyle" : "Default"
                    }
                  >
                    GitHub
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant={
                      variant == "SystemStyle" ? "SystemStyle" : "Default"
                    }
                  >
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant={
                      variant == "SystemStyle" ? "SystemStyle" : "Default"
                    }
                    disabled
                  >
                    API
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant={
                      variant == "SystemStyle" ? "SystemStyle" : "Default"
                    }
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
