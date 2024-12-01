import { PrismaClient } from "@prisma/client";
import Home from '@/app/components/homepage'
import { headers } from 'next/headers'

const prisma = new PrismaClient()


export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams
  try {
    const headersList = await headers();
    const hostUrl = headersList.get('host'); // to get domain


    const fall = await prisma.fall.findUnique({
      where: {
        id: Number(resolvedSearchParams?.id) || 1,
      },
    })

    const userAndAllFalls = await prisma.user.findUnique({
      where: {
        id: Number(fall?.userId)
      },
      include: {
        falls: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
    })

    const { severity, latitude, longitude, createdAt, id } = fall || {}
    const { fname, lname, falls } = userAndAllFalls || {}

    const processedFalls = falls?.map(item => {
      return {
        ...item,
        latitude: item.latitude.toString(),
        longitude: item.longitude.toString(),
        severity: item.severity?.toLowerCase(),
        location: `${item.latitude.toString()}, ${item.longitude.toString()}`
      }
    })

    return (
      <Home
        fname={fname}
        lname={lname}
        severity={severity?.toLowerCase()}
        latitude={latitude?.toString()}
        longitude={longitude?.toString()}
        createdAt={createdAt}
        fallID={id}
        prevFalls={processedFalls}
        url={hostUrl}
      />
    )
  } catch {
    return <div>{`injury id: ${resolvedSearchParams?.id} is not found`}</div>
  }
}
