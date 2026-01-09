import { Link, useMatches, useParams } from "react-router";

type Crumb = {
    label: string;
    to?: string;
}

export const BreadCrumbs = ({lastVisited}: {lastVisited: string}) => {
    const matches = useMatches();
    const {id} = useParams();

    if (!id) console.warn("No id param found in URL for BreadCrumbs component.");

    const isCrumb = (x: Crumb | null): x is Crumb => x !== null;
    console.log(lastVisited);
    


    const crumbs: Crumb[] = matches
        .map((m: any) => {
            const crumbFn = m.handle?.crumb as ((m: any) => Crumb) | undefined;
        return crumbFn ? crumbFn(m) : null;
        })
        .filter(isCrumb);

       if (!crumbs.length) return null;

    return (
        <nav aria-label="Breadcrumb" className={`pl-1  w-full flex flex-col relative `}>
            <ol className="flex items-center gap-2">
              {crumbs.map((c, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                    <li key={idx} className="flex items-center">
                      {isLast || !c.to ? (
                        <span className="text-white" aria-current="page">{c.label}</span>
                        ) : (
                        <Link to={c.to} className="text-blue-600 hover:underline">{c.label}</Link>
                        )}
                        {!isLast && <span className="mx-2 text-gray-400">/</span>}
                    </li>
                );

              })}
            </ol>
           
        </nav>
    )
}