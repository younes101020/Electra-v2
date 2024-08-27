'use client'

import { useSelectedLayoutSegments } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Breadcrumbs() {
  const segments = useSelectedLayoutSegments().reduce((acc, segment, index, array) => {
    if (acc.includes('space')) {
      if (index === array.indexOf('space') + 1) {
        acc.push(segment);
      }
      return acc;
    }
    acc.push(segment);
    return segment === 'space' ? acc : acc;
  }, [] as string[]);

  const capitalizeFirstLetter = (str: string) => 
    str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = `/${segments.slice(0, index + 1).join('/')}`
          const displayText = typeof segment === 'string' ? capitalizeFirstLetter(segment) : segment

          return (
            <BreadcrumbItem key={index}>
              {index > 0 && <ul><BreadcrumbSeparator /></ul> }
              {isLast ? (
                <BreadcrumbPage className="text-primary">{displayText}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink className="text-primary/75 hover:text-primary" href={href}>
                  {displayText}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}