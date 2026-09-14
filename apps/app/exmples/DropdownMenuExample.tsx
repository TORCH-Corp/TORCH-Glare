import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";

import { cn } from "@/utils/cn";

export default function DropdownMenuExample() {
  // One menu, presentation only. This used to map over a `["PresentationStyle", "SystemStyle"]`
  // array and render the same menu twice — but the menu cvas dropped `SystemStyle` long ago
  // (`menuContentStyles` takes only `PresentationStyle`, `MenuItemStyles` only
  // `Default | info | Negative`), so the second copy never typechecked. Variants are left off
  // where the cva default already is the value.
  return (
    <>
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            "text-content-presentation-global-primary"
          )}
        >
          DropdownMenu Variants
        </h2>
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn("p-2 rounded-md bg-[var(--background-presentation-form-base)] border border-[var(--border-presentation-global-primary)] text-[var(--content-presentation-global-primary)]",
                  "text-content-presentation-global-primary"
                )}
              >
                SHOW PresentationStyle
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Settings
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Keyboard shortcuts
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem>
                    Check IT
                  </DropdownMenuCheckboxItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    Team
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent sideOffset={6}>
                        <DropdownMenuItem>
                          Email
                        </DropdownMenuItem>
                        {/* Was `"Warning"`, which `MenuItemStyles` has never had either. `info` is
                            the remaining accent variant — `Negative` is used just below. */}
                        <DropdownMenuItem variant="info">
                          Message
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="Negative">
                          More...
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuItem>
                  GitHub
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  API
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}
