## 1.0.0

- Initial release of the TORCH Glare Components Library.

## 1.0.1

### Added
- `Group`, `Icon`, `Trilling` components added to `Input` component as `Group`, `Icon`, `Trilling` to make building custom inputs easier, and refactor InputField, BadgeField components to use them.
- `Radio` component Added to make building custom radio buttons easier.
- `CheckBox` component Added to make building custom checkboxes easier.
- `AlertDialog` component Added to make building custom alert dialogs easier.
- `SearchField` component Added as Customizable Search Input for specific use cases.


### Changed
- `CheckBoxLabel` component name changed to `LabeledCheckBox`
- `Counter` component name changed to `CountBadge`
- `DropDownButton` component name changed to `Select`
- `LabelLessInput` component name changed to `InnerLabelField`
- `ProfileItem` component name changed to `ProfileMenu`
- `RadioLabel` component name changed to `LabeledRadio`
- `Alert` component name changed to `FieldHint`
- `AttachedPic` component name changed to `AttachmentImagePreview`
- `AttachmentField` component name changed to `ImageAttachment`
- `ButtonField` component name changed to `ActionsGroup`

- `CLI` command name changed from `torchcorp` to `torch-glare`
- `CLI` config file name changed from `torch.json` to `glare.json`
- `CLI` `add-hook` command changed to `hook`
- `CLI` `add-util` command changed to `util`
- `CLI` `add-provider` command changed to `provider`

and many more bug fixes and improvements and cleanup the code base.


## 1.0.2

small bug fixes and improvements.

## 1.0.4

### Changed
- `Switcher` changed to `Switch` component to make building custom switches easier using `@radix-ui/react-switch` component.
- `CLI` `replace` flag added to `addComponent` command to prevent adding the component if it already exists.
### Added
- `Form` component Added to make building custom forms easier using `react-hook-form` and `zod` for validation.


## 1.0.7

### Changed
- `CLI` use typescript instead of javascript to make it more robust and easier to maintain.
- `Radio` component changed to use `@radix-ui/react-radio-group` component.
- `Checkbox` component changed to use `@radix-ui/react-checkbox` component.

### Added

#### New Components
- `Divider` component to make separation between components.
- `Skeleton` component for loading pages.
- `Toggle` component for toggling between two states.
- `Avatar` component for displaying user profile pictures.
- `InputOTP` component for displaying OTP input fields.

## 1.0.8

### Changed
- `InnerLabelField` component size prop changed to `M` by default.
- `BadgeField` component refactored to use `useTagSelection` hook to handle the tag selection and the search and filter and keyboard navigation functionality.

## 1.0.8

### Changed
- `InnerLabelField` component size prop changed to `M` by default.
- `BadgeField` component refactored to use `useTagSelection` hook to handle the tag selection and the search and filter and keyboard navigation functionality.
- `glare-themes` tailwindcss plugin name changed to `mapping-color-system`


### Added

#### New Scripts
- `updateModPlugins` script to automatically update the mode plugins.
- `updateMappingPlugin` script to automatically update the mappingColorSystem plugin.
and fix tailwindcss issues.


## 1.1.0

### Changed
- `AlertDialog` popover position changed to `center` by default.
- `BadgeField` component refactored to use handle single select functionality.
- `CLI` stop modify the tailwind.config.js on first init.


## 1.1.1

<<<<<<< HEAD
### Added

- Add support for version 4 of tailwindcss.


## 1.1.2

### Added

- `Input` component refactored to use hide mask when input is focused.
- `Input` component refactored to use auto scroll to the end of the input when the input is focused.
- `DatePicker` add time picker to the date picker.

## 1.1.3

### Hot Fix

- `DatePicker` fix open date picker issue.

## 1.1.4

### Added

- `Calendar` component added to the library.
- `SlideDatePicker` component added to the library.

### Refactor 

- `DatePicker` refactored to use `Calender` component .
- `DatePicker` use new range, and multuble with Time slider.
- `Button` component type prop changed to `button` by default.
- `MobileSilder` Hook moved to npm as packege.


## 1.1.5

Hot bug fixes.



## 1.1.6

### Refactor

- `DatePicker` use Initial value from value prop.
- `BadgeField` compatible with react-hook-form and fix size issues.


# 1.1.7

### Added 

- `Toast` component added to the library.