import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { type, amount, description, category } = body;

    // Validate input
    if (!type || !amount || !category) {
      return NextResponse.json(
        { error: "Type, amount, and category are required" },
        { status: 400 }
      );
    }

    if (!["income", "expense", "asset"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    // Update transaction in the appropriate table based on type
    let updated = false;
    let updatedTransaction = null;

    if (type === "expense") {
      const result = await sql`
        UPDATE expenses 
        SET 
          amount = ${amount},
          description = ${description || null},
          category = ${category},
          updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      
      if (result.length > 0) {
        updated = true;
        updatedTransaction = result[0];
      }
    } else if (type === "income") {
      const result = await sql`
        UPDATE income 
        SET 
          amount = ${amount},
          description = ${description || null},
          category = ${category},
          updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      
      if (result.length > 0) {
        updated = true;
        updatedTransaction = result[0];
      }
    } else if (type === "asset") {
      const result = await sql`
        UPDATE assets 
        SET 
          current_value = ${amount},
          description = ${description || null},
          updated_at = NOW()
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;
      
      if (result.length > 0) {
        updated = true;
        updatedTransaction = result[0];
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: "Transaction not found or type mismatch" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });

  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Try to delete from each table since we don't know which table the transaction is in
    let deleted = false;
    let deletedFrom = "";

    // Try expenses table
    const expenseResult = await sql`
      DELETE FROM expenses 
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (expenseResult.length > 0) {
      deleted = true;
      deletedFrom = "expenses";
    }

    // Try income table if not found in expenses
    if (!deleted) {
      const incomeResult = await sql`
        DELETE FROM income 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;

      if (incomeResult.length > 0) {
        deleted = true;
        deletedFrom = "income";
      }
    }

    // Try assets table if not found in income
    if (!deleted) {
      const assetResult = await sql`
        DELETE FROM assets 
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING *
      `;

      if (assetResult.length > 0) {
        deleted = true;
        deletedFrom = "assets";
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Transaction deleted successfully",
      deletedFrom
    });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}