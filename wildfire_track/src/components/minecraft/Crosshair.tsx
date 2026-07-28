export const Crosshair = () => {
    return (
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 pointer-events-none z-50">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/80 shadow-sm -translate-y-1/2" />
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white/80 shadow-sm -translate-x-1/2" />
        </div>
    )
}
