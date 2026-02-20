import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ResponsiveTable component
 * 
 * Provides a unified way to handle dashboard tables that need a card view on mobile.
 * 
 * @param {Array} columns - Column definitions: { key, label, renderCell, className, headerClassName }
 * @param {Array} data - Data to display
 * @param {Boolean} loading - Loading state
 * @param {Function} renderCard - Custom renderer for mobile card view (item, index) => ReactNode
 * @param {String} emptyMessage - Message to show when no data
 * @param {ReactNode} icon - Icon to show in empty state
 * @param {String} breakpoint - Tailwind breakpoint to switch (default: 'lg')
 * @param {String} className - Wrapper className
 * @param {String} tableClassName - Table container className
 * @param {String} cardContainerClassName - Card container className
 */
const ResponsiveTable = ({
  columns = [],
  data = [],
  loading = false,
  renderCard,
  emptyMessage = "No items found",
  icon: Icon,
  breakpoint = "lg",
  className = "",
  tableClassName = "",
  cardContainerClassName = "space-y-4"
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-24 bg-white/5 rounded-3xl animate-pulse border border-white/5" 
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          {Icon ? (
            <Icon size={40} className="text-zinc-500" />
          ) : (
             <div className="w-10 h-10 border-2 border-dashed border-zinc-700 rounded-full" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-zinc-300 mb-2">{emptyMessage}</h3>
      </div>
    );
  }

  const desktopViewClass = `hidden ${breakpoint}:block`;
  const mobileViewClass = `${breakpoint}:hidden`;

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile Card View */}
      <div className={`${mobileViewClass} ${cardContainerClassName}`}>
        <AnimatePresence mode="popLayout">
          {data.map((item, index) => (
            <motion.div
              key={item._id || item.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {renderCard ? renderCard(item, index) : (
                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 space-y-4">
                  {columns.map((col, i) => (
                    <div key={i} className="flex justify-between items-start gap-4">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pt-1">
                        {col.label}
                      </span>
                      <div className="text-sm text-zinc-200 text-right">
                        {col.renderCell ? col.renderCell(item, index) : item[col.key]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Desktop Table View */}
      <div className={`${desktopViewClass} bg-white/5 border border-white/5 rounded-[2.5rem] shadow-2xl ${tableClassName} overflow-hidden`}>
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white/5">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-brand-gold border-b border-white/5 whitespace-nowrap ${col.headerClassName || ''} 
                    ${i === 0 ? 'pl-10' : ''} 
                    ${i === columns.length - 1 ? 'pr-10' : ''}
                    ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {data.map((item, rowIndex) => (
                  <motion.tr
                    key={item._id || item.id || rowIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 text-sm ${col.className || ''} 
                        ${colIndex === 0 ? 'pl-10' : ''} 
                        ${colIndex === columns.length - 1 ? 'pr-10' : ''}
                        ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                      >
                        {col.renderCell ? col.renderCell(item, rowIndex) : (
                          <span className="text-zinc-300">{item[col.key]}</span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTable;
