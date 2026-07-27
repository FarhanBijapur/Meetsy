export default function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Meetsy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
