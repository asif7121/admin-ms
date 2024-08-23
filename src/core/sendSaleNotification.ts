import nodemailer from 'nodemailer'
import moment from 'moment'

export const sendSaleNotification = async (sale: any, category: any, sellers: any[]) => {
	// Round off the start date and end date to the nearest hour
	const roundedStartDate = moment(sale.startDate).startOf('minute')
	const roundedEndDate = moment(sale.endDate).startOf('minute')
	// Email content
	const emailContent = `
		<p>Dear Seller,</p>
		<p>We are excited to inform you about an upcoming sale on: <strong>${sale.name}</strong>.</p>
		<p><strong>Description:</strong> ${sale.description}</p>
		<p><strong>Discount:</strong> ${sale.saleDiscount}% off on all products in the category: ${
		category.name
	}</p>
		<p><strong>Start Date:</strong> ${roundedStartDate.format('YYYY-MM-DD h:mm A')}</p>
		<p><strong>End Date:</strong> ${roundedEndDate.format('YYYY-MM-DD h:mm A')}</p>
		<p>We encourage you to add your products in the sale and get ready for the sale!</p>
		<p>Best regards,</p>
		<p>E-commerce app Team</p>
	`

	// Set up nodemailer transporter
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASS,
		},
	})

	// Send email to each seller
	for (const seller of sellers) {
		await transporter.sendMail({
			from: `E-commerce app <${process.env.EMAIL}>`,
			to: seller.email,
			subject: `Upcoming Sale on: ${sale.name}`,
			html: emailContent,
		})
	}
}
