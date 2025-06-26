export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center space-y-6">
        {/* Animated 404 Text */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has
            been moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Navigation Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div> */}

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent" />
      </div>
    </div>
  );
}
