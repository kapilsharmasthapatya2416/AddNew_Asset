import { QuickDataEntryClientWrapper } from './QuickDataEntryClientWrapper';

interface Props {
    children: React.ReactNode;
    locale: string;
    propertyId: string;
}

export async function QuickDataEntryServerLayout({
    children,   
}: Props) {

    return (
        <QuickDataEntryClientWrapper>
            {children}
        </QuickDataEntryClientWrapper>
    );
}