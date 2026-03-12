"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = {
    children: React.ReactNode;
    pendingText: string;
};

export function SubmitButton({
    children,
    pendingText,
}: SubmitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="rounded-2xl" disabled={pending}>
            {pending ? pendingText : children}
        </Button>
    );
}