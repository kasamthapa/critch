import { prisma } from "../lib/prisma";

export const getPaginationPosts = async (
  cursor?: string,
  limit: number = 10,
) => {
  const safeLimit = limit > 0 ? limit : 10;
  const decodedCursor = cursor
    ? JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"))
    : null;

  const data = await prisma.project.findMany({
    take: safeLimit + 1,
    cursor: decodedCursor ? { id: decodedCursor.id } : undefined,
    skip: decodedCursor ? 1 : undefined,
    orderBy: { created_at: "desc" },
  });
  const hasNextPage = data.length > safeLimit;
  const finalData = hasNextPage ? data.slice(0, safeLimit) : data;
  const nextCursor =
    hasNextPage && finalData.length > 0
      ? Buffer.from(
          JSON.stringify({
            id: finalData[finalData.length - 1].id,
          }),
        ).toString("base64")
      : null;
  return {
    data: finalData,
    pagination: {
      nextCursor,
      hasNextPage,
    },
  };
};
