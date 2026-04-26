interface CitationCardProps {
  filename: string;
  page: number;
  quote: string;
}

const CitationCard = ({ filename, page, quote }: CitationCardProps) => {
  return (
    <div
      style={{
        marginTop: 10,
        borderLeft: "3px solid #22c55e",
        backgroundColor: "var(--card-bg)",
        borderRadius: "0 8px 8px 0",
        padding: "10px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          marginBottom: 5,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            backgroundColor: "#22c55e",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 7,
            fontWeight: 700,
            color: "white",
            letterSpacing: -0.5,
            flexShrink: 0,
          }}
        >
          PDF
        </div>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--text-primary)",
          }}
        >
          {filename} — Page {page}
        </span>
      </div>
      <p
        style={{
          fontSize: 11,
          color: "var(--text-secondary)",
          fontStyle: "italic",
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        "{quote}"
      </p>
    </div>
  );
};

export default CitationCard;
