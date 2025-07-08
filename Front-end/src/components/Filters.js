
function Filters({ month, onMonthChange, userName, onUserNameChange, hasImage, onHasImageChange }) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
      {userName !== undefined && (
        <input
          type="text"
          value={userName}
          onChange={e => onUserNameChange(e.target.value)}
          placeholder="User Name"
          className="px-3 py-2 rounded border border-gold bg-[#23242a] text-gold"
        />
      )}
      <select
        value={month}
        onChange={e => onMonthChange(e.target.value)}
        className="px-3 py-2 rounded border border-gold bg-[#23242a] text-gold"
      >
        <option value="">All Months</option>
        {[...Array(12)].map((_, i) => (
          <option key={i+1} value={i+1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
        ))}
      </select>
      <select
        value={hasImage}
        onChange={e => onHasImageChange(e.target.value)}
        className="px-3 py-2 rounded border border-gold bg-[#23242a] text-gold"
      >
        <option value="">All Posts</option>
        <option value="true">With Image</option>
        <option value="false">Without Image</option>
      </select>
    </div>
  );
}

export default Filters;
