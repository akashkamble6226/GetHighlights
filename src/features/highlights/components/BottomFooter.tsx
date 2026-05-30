export function BottomFooter() {
  return (
    <footer className="border-t bg-background/[0.72] backdrop-blur-xl">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          Version {__APP_VERSION__}
        </p>
      </div>
    </footer>
  );
}
