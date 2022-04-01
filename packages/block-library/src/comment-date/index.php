<?php
/**
 * Server-side rendering of the `core/comment-date` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/comment-date` block on the server.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block default content.
 * @param WP_Block $block      Block instance.
 * @return string Return the post comment's date.
 */
function render_block_core_comment_date( $attributes, $content, $block ) {
	if ( ! isset( $block->context['commentId'] ) ) {
		return '';
	}

	$comment = get_comment( $block->context['commentId'] );
	if ( empty( $comment ) ) {
		return '';
	}

	$wrapper_attributes = get_block_wrapper_attributes();
	$link               = get_comment_link( $comment );

	if ( ! empty( $attributes['isLink'] ) ) {
		return sprintf( '<a x-text="comment.date" href="%1s"></a>', esc_url( $link ) );
	}

	return sprintf(
		'<div x-text="comment.date" %1$s></div>',
		$wrapper_attributes
	);
}

/**
 * Registers the `core/comment-date` block on the server.
 */
function register_block_core_comment_date() {
	register_block_type_from_metadata(
		__DIR__ . '/comment-date',
		array(
			'render_callback' => 'render_block_core_comment_date',
		)
	);
}
add_action( 'init', 'register_block_core_comment_date' );
