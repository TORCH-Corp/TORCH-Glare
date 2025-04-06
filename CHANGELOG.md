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


## 1.0.5

### Changed
- `CLI` use typescript instead of javascript to make it more robust and easier to maintain.
- `Radio` component changed to use `@radix-ui/react-radio-group` component.
- `Checkbox` component changed to use `@radix-ui/react-checkbox` component.


