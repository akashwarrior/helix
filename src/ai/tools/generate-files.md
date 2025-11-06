Use this tool to generate and upload code files into an existing Sandbox. It leverages an LLM to create file contents based on the current conversation context and user intent, then writes them directly into the sandbox file system.

The generated files should be considered correct on first iteration and suitable for immediate use in the sandbox environment. This tool is essential for scaffolding applications, adding new features, writing configuration files, or fixing missing components.

All file paths must be relative to the sandbox root (e.g., `src/index.ts`, `package.json`, `components/Button.tsx`).

## When to Use This Tool

Use Generate Files when:

1. You need to create one or more new files as part of a feature, scaffold, or fix
2. The user requests code that implies file creation (e.g., new routes, APIs, components, services)
3. You’re completing a multi-step task that involves generating or updating source code
4. A prior command failed due to a missing file, and you need to supply it

## File Generation Guidelines

- Every file must be complete, valid, and runnable where applicable
- File contents must reflect the user’s intent and the overall session context
- File paths must be well-structured and use consistent naming conventions
- Generated files should assume compatibility with other existing files in the sandbox

## Best Practices

- Avoid redundant file generation if the file already exists and is unchanged
- Use conventional file/folder structures for the tech stack in use
- If replacing an existing file, ensure the update fully satisfies the user’s request

## Examples of When to Use This Tool

<example>
User: Add a `NavBar.tsx` component and include it in `App.tsx`
Assistant: I’ll generate the `NavBar.tsx` file and update `App.tsx` to include it.
*Uses Generate Files to create:*
- `components/NavBar.tsx`
- Modified `App.tsx` with import and usage of `NavBar`
</example>

## When NOT to Use This Tool

Avoid using this tool when:

1. You only need to execute code or install packages (use Run Command instead)
2. You’re waiting for a command to finish (use Wait Command)

## Summary

Use Generate Files to programmatically create or update files in Sandbox. It enables fast iteration, contextual coding, and dynamic file management, all driven by user intent and conversation context.

this is the initial project structure and give pathname based on this structure 


{
    "public": [
        "file.svg",
        "globe.svg",
        "next.svg",
        "vercel.svg",
        "window.svg"
    ],
    "src": {
        "app": [
            "favicon.ico",
            "globals.css",
            "layout.tsx",
            "page.tsx"
        ],
        "components": {
            "ui": [
                "accordion.tsx",
                "alert-dialog.tsx",
                "alert.tsx",
                "animated-background.tsx",
                "animated-group.tsx",
                "animated-number.tsx",
                "aspect-ratio.tsx",
                "avatar.tsx",
                "badge.tsx",
                "border-trail.tsx",
                "breadcrumb.tsx",
                "button-group.tsx",
                "button.tsx",
                "calendar.tsx",
                "card.tsx",
                "carousel.tsx",
                "chart.tsx",
                "checkbox.tsx",
                "collapsible.tsx",
                "command.tsx",
                "context-menu.tsx",
                "cursor.tsx",
                "dialog.tsx",
                "dock.tsx",
                "drawer.tsx",
                "dropdown-menu.tsx",
                "empty.tsx",
                "field.tsx",
                "form.tsx",
                "glow-effect.tsx",
                "hover-card.tsx",
                "image-comparison.tsx",
                "in-view.tsx",
                "infinite-slider.tsx",
                "input-group.tsx",
                "input-otp.tsx",
                "input.tsx",
                "item.tsx",
                "kbd.tsx",
                "label.tsx",
                "magnetic.tsx",
                "menubar.tsx",
                "navigation-menu.tsx",
                "pagination.tsx",
                "popover.tsx",
                "progress.tsx",
                "progressive-blur.tsx",
                "radio-group.tsx",
                "resizable.tsx",
                "scroll-area.tsx",
                "scroll-progress.tsx",
                "select.tsx",
                "separator.tsx",
                "sheet.tsx",
                "sidebar.tsx",
                "skeleton.tsx",
                "slider.tsx",
                "sliding-number.tsx",
                "sonner.tsx",
                "spinner.tsx",
                "spinning-text.tsx",
                "spotlight.tsx",
                "switch.tsx",
                "table.tsx",
                "tabs.tsx",
                "text-effect.tsx",
                "text-loop.tsx",
                "text-morph.tsx",
                "text-roll.tsx",
                "text-scramble.tsx",
                "text-shimmer-wave.tsx",
                "text-shimmer.tsx",
                "textarea.tsx",
                "tilt.tsx",
                "toggle-group.tsx",
                "toggle.tsx",
                "tooltip.tsx",
                "transition-panel.tsx"
            ]
        },
        "hooks": [
            "use-mobile.ts"
        ],
        "lib": [
            "utils.ts"
        ]
    },
    "files": [
        ".gitignore",
        "components.json",
        "eslint.config.mjs",
        "next-env.d.ts",
        "next.config.mjs",
        "package.json",
        "pnpm-lock.yaml",
        "postcss.config.mjs",
        "README.md",
        "tsconfig.json"
    ]
}