namespace RMS.Application.Constants;

/// <summary>
/// Centralized Document Type Constants for Retail Management System.
/// Maps the PurType (ScreenNo) database column values to human-readable domain concepts.
/// </summary>
public static class DocTypeConstants
{
    /// <summary>
    /// Represents a Purchase Screen (ScreenNo = 2).
    /// </summary>
    public const int Purchase = 2;

    /// <summary>
    /// Represents a Purchase Return Screen (ScreenNo = 3).
    /// </summary>
    public const int PurchaseReturn = 3;

    /// <summary>
    /// Represents a Purchase Approval Screen (ScreenNo = 4).
    /// </summary>
    public const int PurchaseApproval = 4;

    /// <summary>
    /// Represents a Purchase Return Approval Screen (ScreenNo = 5).
    /// </summary>
    public const int PurchaseReturnApproval = 5;

    /// <summary>
    /// Represents a Sales Invoice Screen (ScreenNo = 6).
    /// </summary>
    public const int SalesInvoice = 6;

    /// <summary>
    /// Represents a Sales Approval Screen (ScreenNo = 7).
    /// </summary>
    public const int SalesApproval = 7;

    /// <summary>
    /// Represents a Sales Return Screen (ScreenNo = 8).
    /// </summary>
    public const int SalesReturn = 8;

    /// <summary>
    /// Represents a Sales Return Approval Screen (ScreenNo = 9).
    /// </summary>
    public const int SalesReturnApproval = 9;
}
