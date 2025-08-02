import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            res.cookies.set(name, value);
          });
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = req.nextUrl;

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/signin", "/auth/signup", "/onboarding"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isHomeRoute = pathname === "/";

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute && !isHomeRoute) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/auth/signin";
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (
    user &&
    (pathname.startsWith("/auth/signin") || pathname.startsWith("/auth/signup"))
  ) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/documents";
    return NextResponse.redirect(redirectUrl);
  }

  // Handle onboarding redirects for authenticated users
  if (user && pathname === "/documents") {
    // Check if user has completed onboarding by fetching user data
    const { data: userData } = await supabase
      .from("users")
      .select("display_name, university, major, profile_picture_url")
      .eq("id", user.id)
      .single();

    if (userData) {
      const missingFields: string[] = [];

      if (!userData.display_name) {
        missingFields.push("displayName");
      }
      if (!userData.university || !userData.major) {
        missingFields.push("academicInfo");
      }
      if (!userData.profile_picture_url) {
        missingFields.push("profilePicture");
      }

      if (missingFields.length > 0) {
        const queryString = new URLSearchParams({
          missing: missingFields.join(","),
          returnTo: pathname,
        }).toString();
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = `/onboarding?${queryString}`;
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
