"use client";
import { useState } from "react";
import { ActionButton } from "@/components/base/buttons/actionButton";
import { useTheme } from "@/providers/themeProvider";
import { cn } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/base/dropDowns/dropdownMenu";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/base/dropDowns/dropDownMenuItem";
import { FieldSection } from "@/components/shared/forms/fieldSection";
import { Alert } from "@/components/base/alerts/alert";
import { InputField } from "@/components/base/fields/inputField";
import { MenuItem } from "@/components/base/dropDowns/menuItem";
import { LabelLessInput } from "@/components/base/fields/labelLessInput";
import { Button } from "@/components/base/buttons/button";

export default function Examples() {
  const { theme, updateTheme } = useTheme();
  const [sizes] = useState<any>(["XS", "S", "M"]);
  const [anotherSizes] = useState<any>(["S", "M"]);
  const [ButtonSizes] = useState<any>(["S", "M", "L"]);
  const [ThemeVariants] = useState<"PresentationStyle" | "SystemStyle" | any>([
    "PresentationStyle",
    "SystemStyle",
  ]);
  const [ButtonButtonVariants] = useState<any>([
    "PrimeStyle",
    "BlueSecStyle",
    "YelSecStyle",
    "RedSecStyle",
    "BorderStyle",
    "PrimeContStyle",
    "BlueContStyle",
    "RedContStyle",
  ]);

  const [error, setError] = useState(false);
  const [value, setValue] = useState("");
  const variants = ["default", "SystemStyle"];
  const mockIcons = [
    <i className="ri-user-line"></i>,
    <i className="ri-search-line"></i>,
  ];

  return (
    <div
      className={cn("flex flex-col gap-8  p-4 w-full", {
        "bg-white": theme === "light",
        "bg-black": theme === "dark",
      })}
    >
      <Button
        className="fixed top-[10px] right-[10px]"
        onClick={() => updateTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? "GO TO Dark THEME" : "GO TO Light THEME"}{" "}
      </Button>

      <h1
        className={cn(
          "text-xl font-bold mb-8",
          theme === "light" ? "text-black" : "text-white"
        )}
      >
        Action Button Preview
      </h1>
      {sizes.map((size: any) => (
        <div key={size} className="flex flex-col gap-2 w-full">
          <span
            className={cn(
              "text-sm",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            Size: {size}
          </span>
          <ActionButton size={size}>
            <i className="ri-add-circle-fill"></i>
          </ActionButton>
        </div>
      ))}

      <h1
        className={cn("text-xl font-bold", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        Button Variants Preview
      </h1>

      {ButtonButtonVariants.map((variant: any) => (
        <div key={variant} className="mb-8 w-full">
          <h2
            className={cn(
              "text-lg font-semibold mb-4",
              theme === "light" ? "text-black" : "text-white"
            )}
          >
            {variant}
          </h2>
          <div className="flex gap-4 items-center mb-4">
            {ButtonSizes.map((size: any) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <span
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  Size: {size}
                </span>
                <Button variant={variant} size={size}>
                  Button Text
                </Button>
              </div>
            ))}
          </div>

          {/* Icon button ButtonVariants */}
          <div className="flex gap-4 items-center w-full">
            {ButtonSizes.map((size: any) => (
              <div
                key={`icon-${size}`}
                className="flex flex-col items-center gap-2"
              >
                <span
                  className={cn(
                    "text-sm",
                    theme === "light" ? "text-black" : "text-white"
                  )}
                >
                  Icon {size}
                </span>
                <Button variant={variant} size={size} buttonType="icon">
                  <i className="ri-add-circle-fill"></i>
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Loading state examples */}
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          Loading State
        </h2>
        <div className="flex gap-4">
          {ButtonSizes.map((size: any) => (
            <Button key={size} size={size} is_loading>
              Loading
            </Button>
          ))}
        </div>
      </div>

      {/* Disabled state examples */}
      <div className="mt-8 w-full">
        <h2
          className={cn(
            "text-lg font-semibold mb-4",
            theme === "light" ? "text-black" : "text-white"
          )}
        >
          Disabled State
        </h2>
        <div className="flex gap-4">
          {ButtonSizes.map((size: any) => (
            <Button key={size} size={size} disabled>
              Disabled
            </Button>
          ))}
        </div>
      </div>

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

      <h1
        className={cn("text-xl font-bold mb-4", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        FieldSection Styles Preview
      </h1>

      {ButtonSizes.map((size: any) => (
        <div key={size} className="">
          <h2 className="text-lg font-semibold">Size: {size}</h2>
          <FieldSection
            size={size}
            label={`Label`}
            secondaryLabel={`Secondary Label`}
            requiredLabel={`Required`}
            childrenUnderLabel={
              <>
                <Alert
                  component_label={"Warning"}
                  component_state={"Warning"}
                ></Alert>
                <Alert
                  component_label={"Error"}
                  component_state={"Error"}
                ></Alert>
                <Alert
                  component_label={"Info"}
                  component_state={"Info"}
                ></Alert>
                <Alert
                  component_label={"Success"}
                  component_state={"Success"}
                ></Alert>
              </>
            }
          >
            <section className="flex flex-wrap flex-1 gap-[12px]">
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
              <InputField
                size={size !== "L" ? size : "M"}
                placeholder="Input Field"
              />
            </section>
          </FieldSection>
        </div>
      ))}

      <h1
        className={cn("text-2xl", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        InputField Preview
      </h1>

      {/* Loop through variants and sizes */}
      {anotherSizes.map((size: any) =>
        variants.map((variant: any, idx: any) => (
          <div key={`${size}-${variant}`} className="">
            <h2
              className={cn("text-lg font-semibold", {
                "text-black": theme === "light",
                "text-white": theme === "dark",
              })}
            >{`Variant: ${variant}, Size: ${size}`}</h2>
            <InputField
              toolTipSide={"top"}
              size={size}
              variant={variant === "default" ? undefined : variant}
              icon={mockIcons[idx % mockIcons.length]}
              popoverChildren={
                <MenuItem
                  variant={variant == "SystemStyle" ? "SystemStyle" : "Default"}
                  size={size}
                >
                  Dropdown Content
                </MenuItem>
              }
              errorMessage={error ? "This is an error message" : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`InputField (${size} - ${variant})`}
            />
          </div>
        ))
      )}

      {/* Toggle Error State */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>

      <h1
        className={cn("text-2xl", {
          "text-black": theme === "light",
          "text-white": theme === "dark",
        })}
      >
        LabelLessInput Preview
      </h1>

      {/* Loop through sizes and variants */}
      {anotherSizes.map((size: any) =>
        variants.map((variant: any, idx: any) => (
          <div key={`${size}-${variant}`} className="">
            <h2
              className={cn("text-lg font-semibold", {
                "text-black": theme === "light",
                "text-white": theme === "dark",
              })}
            >
              {`Variant: ${variant}, Size: ${size}`}
            </h2>

            {/* Render the LabelLessInput component for each size and variant */}
            <LabelLessInput
              label={`Label`}
              required
              toolTipSide={"top"}
              size={size}
              variant={variant === "default" ? undefined : variant}
              popoverChildren={
                <MenuItem
                  variant={variant == "SystemStyle" ? "SystemStyle" : "Default"}
                  size={size}
                >
                  Dropdown Content
                </MenuItem>
              }
              errorMessage={error ? "This is an error message" : undefined}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`(${size} - ${variant})`}
            />
          </div>
        ))
      )}

      {/* Toggle Error State Button */}
      <Button
        onClick={() => setError((prev) => !prev)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Toggle Error State
      </Button>
    </div>
  );
}
