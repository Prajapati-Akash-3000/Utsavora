import html2canvas from "html2canvas";
export async function exportInvitation(element, filename = "invitation.png") {
  const canvas = await html2canvas(element, {
    scale: 3,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}
