import { Meta, StoryObj } from '@storybook/react';
import { ChangeEvent, ComponentProps, useState } from 'react';
import { AttachedPic, convertImageFileToDataUrl, PicContainer } from '@/index'

type StoryProps = ComponentProps<typeof AttachedPic>;

const meta: Meta<StoryProps> = {
    component: AttachedPic,
    title: 'Components/Upload&Download/AttachedPic',
    argTypes: {}
};

export default meta;

type Story = StoryObj<StoryProps>;

const AttachedPicWrapper: React.FC<StoryProps> = (props) => {
    const [imageSrc, setImageSrc] = useState<string>("https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500");
    const [imagePreviewActive, setImagePreviewActive] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        convertImageFileToDataUrl(file, setImageSrc);
    };

    return (
        <section>

            {imagePreviewActive || imageSrc ? (
                <AttachedPic
                    headerLabel="Preview"
                    src={imageSrc}
                    changeLabel="Change"
                    deleteLabel="Delete"
                    deleteButtonClick={() => {
                        setImageSrc("")
                        setImagePreviewActive(false)
                    }}
                    changeButtonClick={() => {
                        setImageSrc("")
                        setImagePreviewActive(false)
                    }}
                    closeButtonClick={() => setImagePreviewActive(false)}
                />
            ) : (
                <PicContainer
                    {...props}
                    onChange={handleFileChange}
                    id="test"
                    selectedImg={imageSrc}
                    ExpandImageClick={() => setImagePreviewActive(true)}
                />
            )
            }
        </section>
    );
};

export const AttachedPic_Playground: Story = {
    render: (args) => <AttachedPicWrapper {...args} />
};
