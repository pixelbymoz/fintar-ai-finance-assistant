import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Transaction IDs are required" },
        { status: 400 }
      );
    }

    // Delete transactions from all tables
    let totalDeleted = 0;

    // Delete from expenses table
    const expenseResults = await sql`
      DELETE FROM expenses 
      WHERE id = ANY(${ids}) AND user_id = ${userId}
      RETURNING id
    `;
    totalDeleted += expenseResults.length;

    // Delete from income table
    const incomeResults = await sql`
      DELETE FROM income 
      WHERE id = ANY(${ids}) AND user_id = ${userId}
      RETURNING id
    `;
    totalDeleted += incomeResults.length;

    // Delete from assets table
    const assetResults = await sql`
      DELETE FROM assets 
      WHERE id = ANY(${ids}) AND user_id = ${userId}
      RETURNING id
    `;
    totalDeleted += assetResults.length;

    return NextResponse.json({ 
      message: `${totalDeleted} transactions deleted successfully`,
      deletedCount: totalDeleted
    });

  } catch (error) {
    console.error("Error bulk deleting transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}