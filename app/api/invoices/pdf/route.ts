import { NextResponse } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export const runtime = 'nodejs'

export async function POST(req: Request){
  try{
    const { invoice } = await req.json() as any
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89])
    const { width, height } = page.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const drawText = (text: string, x: number, y: number, size=12) => {
      page.drawText(text, { x, y, size, font, color: rgb(0.1,0.1,0.1) })
    }

    drawText('Invoice', 50, height - 50, 20)
    drawText(`Customer: ${invoice.customer_name}`, 50, height - 80)
    drawText(`Date: ${invoice.date}`, 50, height - 100)
    drawText(`Currency: ${invoice.currency}`, 50, height - 120)

    let y = height - 160
    drawText('Items:', 50, y)
    y -= 20
    for(const item of invoice.items){
      drawText(`${item.description}  x${item.quantity} - ${item.unit_price}`, 60, y)
      y -= 18
    }
    y -= 10
    drawText(`Subtotal: ${invoice.subtotal}`, 50, y)

    const bytes = await pdfDoc.save()
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="invoice.pdf"'
      }
    })
  }catch(e:any){
    return NextResponse.json({ error: e?.message || 'Failed' }, { status: 500 })
  }
}
