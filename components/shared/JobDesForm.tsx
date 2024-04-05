"use client"
import { useEffect, useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { any, z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import { updateJobDescription } from "@/lib/actions/user.actions"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Job Description must be at least 50 characters.",
    }).max(3000, {
        message: "Job Description cannot exceed 3000 characters. Only include relevent info!",
    }),
})

export function JobDesForm({ action, data = null, userId, type, creditBalance, config = null, onCompletion}: TransformationFormProps) {

    const [isPending, startTransition] = useTransition()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        startTransition(() => {
            // Perform state transitions here
            updateJobDescription(userId, values.username).then(() => {
                // Code to run after the updateJobDescription function completes
                console.log(values.username);
                onCompletion && onCompletion();
            }).catch(error => {
                // Handle errors if necessary
                console.error("Error updating job description:", error);
            });
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <p style={{ fontSize: '18px' }}>
                    <span style={{ fontSize: '34px', fontWeight: 'bold' }}>1. </span>Copy and paste the Job description here:
                </p>
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea placeholder="Job Description..." {...field} style={{ height: '150px' }} />
                            </FormControl>
                            {/* <FormDescription>
                Copy and paste relevent information from job description.
              </FormDescription> */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <button className='btn-55 ' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <span> Confirm job description</span>
                {/* Any SVG or other content goes here */}
              </button>
                {/* <Button type="submit" style={{ width: '100%' }}>Confirm job description</Button> */}
            </form>
        </Form>
    )
}
