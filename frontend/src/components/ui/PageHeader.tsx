import { Link } from 'react-router-dom';

export interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: string[];
}

export const PageHeader = ({ title, description, breadcrumbs }: PageHeaderProps) => {
  // Generate default breadcrumb based on title if not provided
  let crumbs = breadcrumbs;
  if (!crumbs && title.toLowerCase() !== 'dashboard') {
    if (title === 'Update Profile') {
      crumbs = ['Dashboard', 'Profile', 'Update'];
    } else if (title === 'Change Password') {
      crumbs = ['Dashboard', 'Profile', 'Change Password'];
    } else {
      crumbs = ['Dashboard', title];
    }
  }

  return (
    <div className="flex flex-col text-left mb-5 gap-1.5">
      {crumbs && crumbs.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] font-semibold mb-0.5 select-none">
          {crumbs.map((crumb, idx) => {
            const isLast = idx === crumbs.length - 1;
            const to = crumb.toLowerCase() === 'dashboard' 
              ? '/dashboard' 
              : crumb.toLowerCase() === 'profile' 
                ? '/profile' 
                : '';
            
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span>/</span>}
                {to && !isLast ? (
                  <Link to={to} className="hover:text-[#2563EB] transition-colors">{crumb}</Link>
                ) : (
                  <span className={isLast ? "text-[#4B5563]" : ""}>{crumb}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      <h1 className="page-title">{title}</h1>
      <p className="text-[12px] text-[#6B7280] font-medium leading-normal">{description}</p>
    </div>
  );
};

export default PageHeader;
