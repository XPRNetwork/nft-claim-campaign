import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import project from "./../project.json";
import {XprButton} from "@/components/xpr/xpr-button";
import Link from "next/link";
import XprProvider from "@/components/xpr/xpr-provider";
import {XprSession} from "@/components/xpr/xpr-session";
const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: project.title,
  description: project.description,
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html data-theme={project.theme} lang="en">
      <XprProvider>
        <body className={`${inter.className} bg-base-100 p-4`}>
          <div className="grid grid-cols-1 gap-4 container">
            <div className="navbar bg-base-200 rounded-lg">
              <div className="flex-1">
                <Link
                  href={"/"}
                  className="btn btn-ghost text-xl text-base-content"
                >
                  {project.title}
                </Link>
              </div>
              <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                  {project["main-menu"].map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          target={"_blank"}
                          className="text-base-content"
                          href={item.href}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <XprButton>
                  <XprSession />
                </XprButton>
              </div>
            </div>
            {children}
            <footer className="footer p-10 bg-base-200 text-base-content rounded-lg">
              <aside>
                <Link
                  href={"/"}
                  className="text-xl font-bold text-base-content"
                >
                  {project.title}
                </Link>
                <p>
                  {project.footer["legal-name"]}
                  <br />
                  {project.footer["baseline"]}
                </p>
              </aside>
              {project.footer.navs.map((nav, index) => {
                return (
                  <nav key={index}>
                    <header className="footer-title">{nav.label}</header>
                    {nav.items.map((item, index) => {
                      return <Link key={index} href={item.href} className="link link-hover">{item.label}</Link>
                    })}
                  </nav>
                );
              })}
            </footer>
          </div>
        </body>
      </XprProvider>
    </html>
  );
}
